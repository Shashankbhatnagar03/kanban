import Input from "./Input";

const Modal = ({
  closeModal,
  title,
  action,
  isCreate,
}: {
  isCreate: boolean;
  action: (formData: FormData) => Promise<void>;
  title: string;
  closeModal: () => void;
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    action(formData); // Call the action with form data
  };

  return (
    <div
      className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50 z-10"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full transition-transform transform hover:scale-105"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold mb-4 text-center ">{title}</h2>
        <form onSubmit={handleSubmit}>
          {isCreate && (
            <>
              <Input
                type="text"
                name="title" // Task title
                placeholder="Enter task name"
                fullWidth
              />
              <Input
                type="text"
                name="description" // Task description
                placeholder="Enter task description"
                fullWidth
              />

              <Input
                type="date"
                name="dueDate"
                placeholder="Due Date"
                fullWidth
              />
              <div className="mt-2 mb-4">
                <label className="block mb-1 text-sm font-medium text-red-600">
                  Priority
                </label>
                <select
                  name="priority"
                  className="w-full border border-red-300 rounded-lg p-2 focus:ring focus:ring-red-300 h-12 text-lg"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </>
          )}
          <div className="mt-5 flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition duration-200 transform hover:scale-105"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 text-black font-semibold rounded-lg shadow hover:bg-gray-400 transition duration-200 transform hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
