import RegisterForm from "./layout/RegisterForm";

function App() {
  return (
    <div className="min-h-screen">
      <h1 className="text-4xl text-pink-50 text-center border bg-fuchsia-400 py-5 m-6 font-bold">
        Hello world!
      </h1>
      <input
        type="checkbox"
        value="light"
        className="toggle theme-controller"
      ></input>
      <hr />
      <RegisterForm />
    </div>
  );
}

export default App;
