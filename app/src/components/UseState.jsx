import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(10); // Initial state is 0

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
}


function UserProfile() {
  const [user, setUser] = useState({ name: "John Doe", age: 25 });

  const updateName = () => {
    setUser({ ...user, name: "Karan Dutt Sharma",age:21 })
  };

  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Age: {user.age}</p>
      <button onClick={updateName}>Change</button>
    </div>
  );
}

export default UserProfile;


// export default Counter;