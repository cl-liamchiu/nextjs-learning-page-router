import { useAppDispatch, useAppSelector } from "@/store/store";
import { increment, addBy, reset } from "@/store/counter-slice";

export default function Home() {
  const count = useAppSelector((s) => s.counter.value);
  const dispatch = useAppDispatch();

  return (
    <main style={{ padding: 24 }}>
      <h1>Counter: {count}</h1>
      <button onClick={() => dispatch(increment())}>+1</button>
      <button onClick={() => dispatch(addBy(5))}>+5</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
    </main>
  );
}
