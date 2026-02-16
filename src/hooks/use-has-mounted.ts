import { useSyncExternalStore } from 'react';

function subscribe() {
	return () => undefined;
}

function getClientSnapshot() {
	return true;
}

function getServerSnapshot() {
	return false;
}

/**
 * React hook to determine if the component has been mounted on the client.
 */
export function useHasMounted() {
	return useSyncExternalStore(
		subscribe,
		getClientSnapshot,
		getServerSnapshot
	);
}
