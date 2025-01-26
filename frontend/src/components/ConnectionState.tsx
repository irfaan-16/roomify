export function ConnectionState({ isConnected }: { isConnected: boolean }) {
  return <p className="text-white">State: {"" + isConnected}</p>;
}
