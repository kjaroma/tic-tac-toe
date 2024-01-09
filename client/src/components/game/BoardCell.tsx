type BoardCellProps = {
    onCellClick: (e: React.MouseEvent) => void
    cellValue: string
}


function BoardCell({ onCellClick, cellValue }: BoardCellProps) {
    return (
        <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold w-24 h-24 border border-gray-400 rounded shadow" onClick={onCellClick}>{cellValue}</button>
    )
}

export default BoardCell