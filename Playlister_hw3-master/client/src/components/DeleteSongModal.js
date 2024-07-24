//import React store
import React, { useContext, useMemo } from "react";
import { GlobalStoreContext } from "../store";
import DeleteSongs_Transaction from "../transactions/DeleteSongs_Transaction";

export default function DeleteSongModal({ show, index, setDeleteModal }) {
    const { store, tps } = useContext(GlobalStoreContext);

    const currentSong = useMemo(() => {
        return store.currentList.songs[index];
    }, [index, store]);

    return (
        <div
            className={`modal ${show && "is-visible"}`}
            id="remove-song-modal"
            data-animation="slideInOutLeft"
        >
            <div className="modal-root" id="verify-remove-song-root">
                <div className="modal-north">Remove song?</div>
                <div className="modal-center">
                    <div className="modal-center-content">
                        Are you sure you wish to remove{" "} <span id="remove-song-span">{currentSong?.title}</span>{" "} from the playlist?
                    </div>
                </div>
                <div className="modal-south">
                    <input
                        type="button"
                        id="remove-song-confirm-button"
                        className="modal-button"
                        value="Confirm"
                        onClick={() => {
                            
                            tps.addTransaction(
                                new DeleteSongs_Transaction(store, index, {
                                    artist: currentSong.artist,
                                    title: currentSong.title,
                                    youTubeId: currentSong.youTubeId,
                                })
                            );
                            setDeleteModal(false);
                        }}
                    />
                    <input
                        type="button"
                        id="remove-song-cancel-button"
                        className="modal-button"
                        value="Cancel"
                        onClick={() => setDeleteModal(false)}
                    />
                </div>
            </div>
        </div>
    );
}