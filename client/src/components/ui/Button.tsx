function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full disabled:bg-blue-400 disabled:cursor-not-allowed"
        {...props} />
}

export default Button