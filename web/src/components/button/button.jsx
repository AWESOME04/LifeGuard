export default function Button({ text, isLoading, type = "submit", onClick }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isLoading}
            className={`w-full py-3 text-white font-semibold rounded-[10px] transition duration-300 flex items-center justify-center
                ${isLoading ? "bg-loading cursor-not-allowed" : "bg-custom-blue hover:bg-custom-blue-hover"}
            `}
        >
            {isLoading ? (
                <>
                    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Please wait...</span>
                </>
            ) : (
                text
            )}
        </button>
    );
}
  