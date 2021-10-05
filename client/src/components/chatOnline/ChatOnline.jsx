import React, { useEffect, useState } from "react";
import "./chatOnline.css";
import axios from "axios";

function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
    // useState()
    const [friends, setFriends] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    // useEffect()
    useEffect(() => {
        const getFriends = async () => {
            const res = await axios.get("/users/friends/" + currentId);
            console.log(res.data);
            setFriends(res.data);
        };
        getFriends();
    }, [currentId]);

    // nếu friend online thì sẽ setOnline
    useEffect(() => {
        setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
    }, [friends, onlineUsers]);

    // Function
    const handleClick = async (user) => {
        try {
            const res = await axios.get(
                `/conversations/find/${currentId}/${user._id}`
            );
            setCurrentChat(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="chatOnline">
            {onlineFriends.map((online) => (
                <div
                    key={online._id}
                    className="chatOnlineFriend"
                    onClick={() => {
                        handleClick(online);
                    }}
                >
                    <div className="chatOnlineImgContainer">
                        <img
                            className="chatOnlineImg"
                            src={
                                online.profilePicture
                                    ? PF + online.profilePicture
                                    : PF + "person/noAvatar.png"
                            }
                            alt=""
                        />
                        <div className="chatOnlineBadge"></div>
                    </div>
                    <span className="chatOnlineName">{online.username}</span>
                </div>
            ))}
        </div>
    );
}

export default ChatOnline;
