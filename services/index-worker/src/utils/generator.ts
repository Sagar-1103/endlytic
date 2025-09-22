import { Document } from "@langchain/core/documents";
import { postmanCollectionSchema } from "./schema";
import { v4 as uuidv4 } from "uuid";
import { PineconeStore } from "@langchain/pinecone";

async function synthesisPath(vectors:Document[],root:any,parsedCollectionId:string,folderPath:string) {
  if (!root || root.length === 0) return;

   let currentPath = folderPath;
   
  for (const node of root) {
      if (node.request?.url) {
        node.path = currentPath;
        const doc = {
            id: uuidv4(),
            pageContent: JSON.stringify(node),
            metadata: { collectionId: parsedCollectionId},
        };
        vectors.push(doc);
    }

    if (node.item && node.item.length > 0) {
        await synthesisPath(vectors,node.item,parsedCollectionId,currentPath+`/${node.name}`);
    }
  }
}

export async function splitCollection(url: string,vectorStore:PineconeStore) {
  const response = await fetch(url);
  const collection = await response.json();
  const parsedCollection = postmanCollectionSchema.parse(collection);
  const root = parsedCollection.item;

  const vectors: Document[] = [];
  let folderPath = `.`;

  await synthesisPath(vectors,root,parsedCollection.id,folderPath);
    
  await vectorStore.addDocuments(vectors);
  return parsedCollection;
}
