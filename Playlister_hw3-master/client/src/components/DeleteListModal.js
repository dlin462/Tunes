
import React, { Component, useState, useContext } from "react";
import { GlobalStoreContext } from "../store";
export default function DeleteListModal(props) {
    const { store } = useContext(GlobalStoreContext);

    const { idNamePair, show, setShow } = props;
    const { _id, name } = idNamePair;
    return (
        <div
            className={`modal ${show && "is-visible"}`}
            id="delete-list-modal"
            data-animation="slideInOutLeft"
        >
            <div className="modal-root" id="verify-delete-list-root">
                <div className="modal-north">Delete the playlist?</div>
                <div className="modal-center">
                    <div className="modal-center-content">
                        Are you sure you wish to delete <span>{" " + name + " "}</span> playlist?
                    </div>
                </div>
                <div className="modal-south">
                    <input
                        type="button" id="delete-list-confirm-button" className="modal-button"

                        onClickCapture={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            store.deleteListById(_id);
                        }}
                        value="Confirm"
                    />
                    <input
                        type="button" id="delete-list-cancel-button" className="modal-button"

                        onClickCapture={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShow(false);
                        }}
                        value="Cancel"
                    />
                </div>
            </div>
        </div>
    );
}