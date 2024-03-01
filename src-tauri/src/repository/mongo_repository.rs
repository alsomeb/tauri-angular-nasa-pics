use std::env;

use futures_util::TryStreamExt;
use mongodb::{Client, Collection, Database};
use mongodb::bson::doc;
use mongodb::bson::oid::ObjectId;
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

    pub async fn get_albums_by_user_id(&self, id: &str) -> Result<Vec<Album>, Error> {
        let col = MongoRepository::collection_switch::<Album>(&self, CollectionName::Album).await;
        let user_id = ObjectId::parse_str(id).unwrap_or_default();

        let mut cursors = col
            .find(doc! {"_id": user_id}, None)
            .await?;

        let mut albums: Vec<Album> = Vec::new();

        // This is a loop that will continue to run as long as the pattern matching succeeds.
        // In this case, the pattern is Some(album), which matches the Option type returned by the try_next() method call.

        // Here, Some(album) means that if the try_next() method returns a Some variant (indicating that there is a next item in the stream),
        // then the album variable inside the Some will be bound to that item.

        // try_next(): This method is called on cursors, which is an asynchronous stream of documents retrieved from a MongoDB collection.
        // The try_next() method attempts to fetch the next item from the stream.
        // It returns a Result<Option<Album>, Error>, where Ok(Some(album)) indicates a successfully retrieved album, Ok(None) indicates the end of the stream (no more items)

        // The loop body ({ albums.push(album) }): For each album successfully matched by Some(album),
        // the loop body executes. In this case, it adds the album to the albums vector using the push method.
        while let Some(album) = cursors
            .try_next()
            .await?
        {
            albums.push(album)
        }

        Ok(albums)
    }

    pub async fn create_album(&self, album: Album) -> Result<String, Error> {
        let col = MongoRepository::collection_switch::<Album>(&self, CollectionName::Album).await;

        let result = col
            .insert_one(album, None) // Note that either an owned or borrowed value can be inserted here, so the input document does not need to be cloned to be passed in.
            .await?;

        Ok(result.inserted_id.to_string())
    }

}
