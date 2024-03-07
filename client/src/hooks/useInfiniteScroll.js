import { useState, useEffect, useRef } from 'react';

function useInfiniteScroll(callback, direction = 'down') {
    const [isFetching, setIsFetching] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const handleScroll = () => {
            const shouldFetch =
                direction === 'up'
                    ? element.scrollTop === 0
                    : element.scrollHeight - element.scrollTop === element.clientHeight;

            if (!shouldFetch || isFetching) return;
            setIsFetching(true);
        };

        element.addEventListener('scroll', handleScroll);
        return () => element.removeEventListener('scroll', handleScroll);
    }, [isFetching, direction]);

    useEffect(() => {
        if (!isFetching) return;
        callback(() => setIsFetching(false));
    }, [isFetching]);

    return [isFetching, setIsFetching, elementRef];
}

export default useInfiniteScroll;
