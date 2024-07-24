import React, { useContext, useEffect, useMemo, useState } from "react";
import { GlobalStoreContext } from "../store";
import EditSongs_Transaction from "../transactions/EditSongs_Transaction";

export default function EditSongModal({ show, index, setShow }) {
    const { store, tps } = useContext(GlobalStoreContext);
    const currentSong = store.currentList.songs[index];
    const [state, setstate] = useState({
        artist: currentSong?.artist || "",
        title: currentSong?.title || "",
        youTubeId: currentSong?.youTubeId || "",
    });

    const thisOne = useMemo(() => {
        //length of a,t,y
        return (
            !!state.artist.length &&
            !!state.title.length &&
            !!state.youTubeId.length 
        );
    }, 
    [state]);
    const handleConfirm = () => {

        tps.addTransaction(
            new EditSongs_Transaction(store, index, currentSong, state)
        );
        setShow(false);
    };

    useEffect(() => {
        if (currentSong) {
            setstate({
                artist: currentSong.artist,
                title: currentSong.title,
                youTubeId: currentSong.youTubeId,
            });
        }
    },
    [currentSong]);

    return (
        <div
            className={`modal ${show && "is-visible"}`}
            id="edit-song-modal"
            data-animation="slideInOutLeft"
        >
            <div className="modal-root" id="edit-song-root">
                <div id="edit-song-modal-header" className="modal-north">
                    Edit Song
                </div>
                <div id="edit-song-modal-content">
                    <div id="title-prompt" className="modal-prompt">
                        Title:
                    </div>
                    <input
                        id="edit-song-modal-title-textfield"
                        className="modal-textfield"
                        type="text"
                        value={state.title}
                        //ta - allows on change
                        onChange={(e) => {
                            setstate((pre) => ({
                                ...pre,
                                title: e.target.value,
                            }));
                        }}
                    />
                    <div id="artist-prompt" className="modal-prompt">
                        Artist:
                    </div>
                    <input
                        id="edit-song-modal-artist-textfield"
                        className="modal-textfield"
                        type="text"
                        value={state.artist}
                        //ta
                        onChange={(e) => {
                            setstate((pre) => ({
                                ...pre,
                                artist: e.target.value,
                            }));
                        }}
                    />
                    <div id="you-tube-id-prompt" className="modal-prompt">
                        YouTubeId:
                    </div>
                    <input
                        id="edit-song-modal-youTubeId-textfield"
                        className="modal-textfield"
                        type="text"
                        value={state.youTubeId}
                        onChange={(e) => {
                            setstate((pre) => ({
                                ...pre,
                                youTubeId: e.target.value,
                            }));
                        }}
                    />
                </div>
                <div className="modal-south">
                    <input
                        disabled={!thisOne}
                        type="button"
                        id="edit-song-confirm-button"
                        className="modal-button"
                        value="Confirm"
                        onClick={handleConfirm}
                    />
                    <input
                        type="button"
                        id="edit-song-cancel-button"
                        className="modal-button"
                        value="Cancel"
                        onClick={() => setShow(false)}
                    />
                </div>
            </div>
        </div>
    );
}