import { ReadyState } from "react-use-websocket";

type ConnectionStatusProps = {
    readyState: ReadyState
}

function ConnectionStatus({ readyState }: ConnectionStatusProps) {
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];
    return (
        <div>Connection status: {connectionStatus}</div>
    )
}

export default ConnectionStatus