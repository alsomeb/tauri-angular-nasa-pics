use std::env;

use futures_util::TryStreamExt;
use mongodb::{Client, Collection, Database};
use mongodb::error::Error;

use crate::models::user_model::User;

pub struct MongoRepository {
    db: Database
}

// Helper Enum Which Contains All Collection Names
pub enum CollectionName {
    User
}


impl MongoRepository {
    pub async fn init() -> Self {
        let mongo_uri = match env::var("MONGO_URI") {
            Ok(uri) => uri.to_string(),
            Err(_) => "Err loading mongo_uri from .env".to_string()
        };

        // Om ej MONGO_URI finns kommer thread panic och vi får Err msg från ovan
        let mongo_client = Client::with_uri_str(mongo_uri)
            .await
            .unwrap();

        let db = mongo_client.database("alsomeb"); // Databas namn på MongoDB

        Self {db}
    }

    pub async fn collection_switch<T>(data_source: &Self, col_name: CollectionName) -> Collection<T> {
        match col_name {
            CollectionName::User => data_source.db.collection("Users"),
            // TODO flera Collections
        }
    }

    pub async fn get_all_users(&self) -> Result<Vec<User>, Error> {
        // Vi typar Collectionen med ::<User>
        let col = MongoRepository::collection_switch::<User>(&self, CollectionName::User).await;

        let mut cursors = col
            .find(None, None) // without any options & filters to match all documents
            .await?;

        let mut users: Vec<User> = Vec::new();

        while let Some(user) = cursors
            .try_next()
            .await?
        {
            users.push(user)
        }

        Ok(users)
    }

}
