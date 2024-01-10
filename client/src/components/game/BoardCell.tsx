import IconCircle from "../icons/Circle"
import IconCross from "../icons/Cross"

type BoardCellProps = {
    onCellClick: (e: React.MouseEvent) => void
    cellValue: string;
    winHighlight: boolean;
}

function BoardCell({ onCellClick, cellValue, winHighlight }: BoardCellProps) {

    const getIcon = (cellValue: string) => {
        if (cellValue === "x") {
            return <IconCross width={64} height={64} fill="#3b82f6" />
        }
        if (cellValue === "o") {
            return <IconCircle width={64} height={64} fill="#ffffff" />
        }
        return " "
    }

    return (
        <div className={`${winHighlight ? 'bg-green-900' : 'bg-gray-800'} ${winHighlight ? 'hover:bg-green-800' : 'bg-gray-800'} hover:bg-gray-700 text-gray-100 font-semibold w-24 h-24 border border-gray-900 rounded-lg shadow m-2 flex flex-col justify-center items-center cursor-pointer`}
            onClick={onCellClick}>{getIcon(cellValue)}
        </div>
    )
}

export default BoardCell