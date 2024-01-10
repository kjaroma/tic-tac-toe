function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return <input className="shadow border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        {...props} />
}

export default Input