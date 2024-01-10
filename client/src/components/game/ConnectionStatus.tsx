import { ReadyState } from "react-use-websocket";

type ConnectionStatusProps = {
    readyState: ReadyState
}

function ConnectionStatus({ readyState }: ConnectionStatusProps) {
    const [status, color] = {
        [ReadyState.CONNECTING]: ['Connecting', "bg-gray-300"],
        [ReadyState.OPEN]: ['Open', "bg-green-600"],
        [ReadyState.CLOSING]: ['Closing', "bg-gray-300"],
        [ReadyState.CLOSED]: ['Closed', "bg-red-600"],
        [ReadyState.UNINSTANTIATED]: ['Uninstantiated', "bg-red-600"],
    }[readyState];
    return (
        <div className="text-gray-300 pt-4">Connection: {status} <span className={`rounded-full w-3 h-3 inline-block ml-1 ${color}`}></span></div>
    )
}

export default ConnectionStatus