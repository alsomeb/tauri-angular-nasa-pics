use std::env;

use futures_util::TryStreamExt;
use mongodb::{Client, Collection, Database};
use mongodb::error::Error;
use crate::models::album_model::Album;

pub struct MongoRepository {
    db: Database
}

// Helper Enum Which Contains All Collection Names
pub enum CollectionName {
    Album
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
            CollectionName::Album => data_source.db.collection("Albums"),
            // TODO flera Collections
        }
    }

    pub async fn get_all_albums(&self) -> Result<Vec<Album>, Error> {
        // Vi typar Collectionen med ::<User>
        let col = MongoRepository::collection_switch::<Album>(&self, CollectionName::Album).await;

        let mut cursors = col
            .find(None, None) // without any options & filters to match all documents
            .await?;

        let mut albumbs: Vec<Album> = Vec::new();

        while let Some(album) = cursors
            .try_next()
            .await?
        {
            albumbs.push(album)
        }

        Ok(albumbs)
    }

}
