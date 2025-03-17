import Peer, { MediaConnection } from "peerjs";
import { useRef, useState } from "react";
import { useEffect } from "react";
import socket from "../socket/socket";
import toast from "react-hot-toast";
import { useChess } from "../context/ChessContext";

export const usePeerJS = () => {
  // get user id from useChessLogic (useChess context)
  const { you, roomInfo } = useChess();

  // peer
  const [peer, setPeer] = useState<Peer | null>(null);
  const [myPeerId, setMyPeerId] = useState<string | null>(null);
  const [friendPeerId, setFriendPeerId] = useState<string | null>(null);
  const [activeConnection, setActiveConnection] = useState<any[]>(); // call connections

  // media stream
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  // const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const [isCallActive, setIsCallActive] = useState<boolean>(false); // for showing call function button
  const [answerModal, setAnswerModal] = useState<boolean>(false); // for showing answer modal

  // ========== useRef ========== //
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const friendVideoRef = useRef<HTMLVideoElement>(null);

  // ========== function ========== //
  // peer call
  const callPeer = async (friendPeerId: string) => {
    if (!peer || !myPeerId || !friendPeerId) return;

    try {
      // get my webcam stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // set local stream
      setLocalStream(stream);

      // call friend
      const call = peer.call(friendPeerId, stream);

      // show my video
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
        myVideoRef.current.play();
      }

      // listen to the remote stream send back from the friend
      call.on("stream", (remoteStream) => {
        // show friend's video
        if (friendVideoRef.current) {
          friendVideoRef.current.srcObject = remoteStream;
          friendVideoRef.current.play();
        }
      });
    } catch (e) {
      console.log(e);
      toast.error("Failed to call friend !");
    }
  };

  // socket emit => for video call button to invoke
  const emitCallRequest = () => {
    if (!myPeerId || !you?.userId) return;

    // emit call request to the friend
    socket.emit("call:request", {
      userId: you?.userId,
      peerId: myPeerId,
      roomId: roomInfo?.roomId,
    });
  };

  // socket emit => for answer modal to invoke
  const emitCallAnswer = (accept: boolean) => {
    if (!myPeerId || !you?.userId) return;

    // send answer info to the caller
    socket.emit("call:answer", {
      userId: you?.userId,
      peerId: myPeerId,
      roomId: roomInfo?.roomId,
      accept,
    });
  };

  // handle call request
  const handleCallRequest = (data: {
    userId: string;
    peerId: string;
    roomId: string;
  }) => {
    console.log(data);

    // show answer modal
    setAnswerModal(true);

    // set friend peer id
    setFriendPeerId(data.peerId);
  };

  // handle call answer
  const handleCallAnswer = (data: {
    userId: string;
    peerId: string;
    roomId: string;
    accept: boolean;
  }) => {
    console.log(data);

    // set friend peer id
    setFriendPeerId(data.peerId);

    // if the answer is accepted, call the friend
    if (data.accept) {
      callPeer(data.peerId);
    }
  };

  // ========== useEffect ========== //
  useEffect(() => {
    // listen to the call request from the friend
    socket.on("call:request", handleCallRequest);

    // listen to the call answer from the friend
    socket.on("call:answer", handleCallAnswer);

    return () => {
      socket.off("call:request", handleCallRequest);
      socket.off("call:answer", handleCallAnswer);
    };
  }, []);

  useEffect(() => {
    const newPeer = new Peer(); // peer instance

    // set peer instance to the peer state
    setPeer(newPeer);

    // listen to the peer open event
    newPeer.on("open", (id) => {
      setMyPeerId(id);
    });

    // listen peer call event
    newPeer.on("call", async (call: MediaConnection) => {
      console.log(call);

      try {
        // get my webcam stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        // set local stream
        setLocalStream(stream);

        // show my video
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
          myVideoRef.current.play();
        }

        // answer the call
        call.answer(stream);

        // listen to the remote stream send back from the friend
        call.on("stream", (remoteStream) => {
          if (friendVideoRef.current) {
            friendVideoRef.current.srcObject = remoteStream;
            friendVideoRef.current.play();
          }
        });
      } catch (e) {
        console.log(e);
        toast.error("Failed to get user media !");
      }
    });

    return () => {
      newPeer.destroy();
    };
  }, []);
};
