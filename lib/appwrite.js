import { Client, Account, ID, Avatars, Databases, Query } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.inspirelab.aworun',
    projectId: 'projectId',
    databaseId: 'databaseId',
    userCollectionId: 'userCollectionId',
    videoCollectionId: 'videoCollectionId',
    storageId: 'storageId'
};

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
} = config;

let client;
let account;

client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

account = new Account(client);
const avartars = new Avatars(client);
const databases = new  Databases(client)

export async function createUser(email, password, username) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );
        if (!newAccount) throw new Error;
        const avatarUrl = avartars.getInitials(username);
        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        );
        
        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export async function signIn(email, password) {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentuser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentuser) throw Error;

        return currentuser.documents[0];
    } catch (error) {
        console.log(error);
    }
}

export async function getAllPosts() {
    try {
        const post = await databases.listDocuments(
            databaseId,
            videoCollectionId,
        );
        return post.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getLatestpost() {
    try {
        const post = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        );
        return post.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export async function searchPosts(query) {
    try {
        const post = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title', query)]
        );
        return post.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getuserPosts(userId) {
    try {
        const post = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('creator', userId)]
        );
        return post.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export async function signOut() {
    try {
        const session = await account.deleteSession('current');
        
        return session;
    } catch (error) {
        throw new Error(error);
    }
}
