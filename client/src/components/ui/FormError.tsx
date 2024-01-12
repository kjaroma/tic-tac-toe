type FormErrorProps = {
    message: string
}

function FromError({message}: FormErrorProps) {
    return (
        <div className='text-red-500 text-xs mb-3 h-4 truncate'>{message.replace('body/','')}</div>
    )
}

export default FromError