import { createContext, useState } from "react";
import jsTPS from "../common/jsTPS";
import api from "../api";
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    DELETE_LIST: "DELETE_LIST",
};

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                });
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                });
            }
            case GlobalStoreActionType.DELETE_LIST: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                });
            }

            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                });
            }
            default:
                return store;
        }
    };

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST

        (async () => {
            try {
                let response = await api.getPlaylistById(id);
                if (response.data.success) {
                    let playlist = response.data.playlist;
                    response = await api.updatePlaylistById(playlist._id, {
                        name: newName,
                        songs: playlist.songs,
                    });
                    if (response.data.success) {
                        response = await api.getPlaylistPairs();
                        if (response.data.success) {
                            let pairsArray = response.data.idNamePairs;
                            storeReducer({
                                type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                payload: {
                                    idNamePairs: pairsArray,
                                    playlist: { ...playlist, name: newName },
                                },
                            });
                        } else {
                            throw response;
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }
        })();
    };

    store.createNewList = function (playlist) {

        (async () => {
            try {
                let response = await api.createPlaylist(playlist);
                if (response.data.success) {
                    let playlist = response.data.playlist;
                    response = await api.getPlaylistPairs();
                    if (response.data.success) {
                        let pairsArray = response.data.idNamePairs;
                        storeReducer({
                            type: GlobalStoreActionType.CREATE_NEW_LIST,
                            payload: {
                                idNamePairs: pairsArray,
                                playlist: playlist,
                            },
                        });
                    }
                }
            } catch (e) {
                console.error(e);
            }
        })();
    };

    store.deleteListById = function (id) {
        (async () => {
            try {
                let response = await api.deletePlaylistByid(id);
                if (response.data.success) {
                    response = await api.getPlaylistPairs();
                    if (response.data.success) {
                        let pairsArray = response.data.idNamePairs;
                        storeReducer({
                            type: GlobalStoreActionType.DELETE_LIST,
                            payload: pairsArray,
                        });
                    }
                }
            } catch (e) {
                console.error(e);
            }
        })();
    };

    store.updateCurrentList = function (id, playlist) {
        (async () => {
            try {
                let response = await api.updatePlaylistById(id, playlist);
                if (response.data.success) {
                    response = await api.getPlaylistById(id);
                    if (response.data.success) {
                        const playlist = response.data.playlist;
                        storeReducer({
                            type: GlobalStoreActionType.SET_CURRENT_LIST,
                            payload: playlist,
                        });
                    }
                }
            } catch (e) {
                console.error(e);
            }
        })();
    };

    store.setIsListNameEditActive = function (id) {
        (async () => {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
                    payload: playlist,
                });
            }
        })();
    };

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {},
        });
    };

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray,
                });
            } else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    };

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist,
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    };

    store.addSong = function (index, song) {
        let songList = [];
        let playlists = store.currentList;
        const name = playlists.name;
        const id = playlists._id;
        
        for (let i = 0; i < index; i++) {
            songList.push(playlists.songs[i]);
        }
        songList.push(song);
        for (let i = index; i < playlists.songs.length; i++) {
            songList.push(playlists.songs[i]);
        }
        store.updateCurrentList(id, {
            name,
            songs: songList ,
        });
    };

    store.deleteSong = function (index) {
        let playlists = store.currentList;
        const name = playlists.name;
        const id = playlists._id;
        let songs = playlists.songs;
        songs.splice(index, 1);
        //update
        store.updateCurrentList(id, {
            name,
            songs,
        });
    };

    store.moveSong = function (oldId, newId) {
        if (oldId !== newId) {
            let playlists = store.currentList;
            const name = playlists.name;
            const id = playlists._id;
            let songs = playlists.songs;
            let temp = songs[newId];
            songs[newId] = songs[oldId];
            songs[oldId] = temp;
            //update
            store.updateCurrentList(id, {
                name,
                songs,
            });
        }
    };

    store.editSong = function (index, song) {
        let playlists = store.currentList;
        const name = playlists.name;
        const id = playlists._id;
        let songs = playlists.songs;
        songs[index] = song;
        //update
        store.updateCurrentList(id, {
            name,
            songs,
        });
    };

    store.getPlaylistSize = function () {
        return store.currentList.songs.length;
    };
    store.undo = function () {
        tps.undoTransaction();
    };
    store.redo = function () {
        tps.doTransaction();
    };

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null,
        });
    };

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, tps, storeReducer };
};