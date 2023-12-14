#ifndef QUEUE_H
#define QUEUE_H

template <typename T, int size>
class Queue {
    T array[size];
    volatile int insert;
    volatile int first;

    public:
        volatile int amount;
        T null;

        Queue() {
            amount = 0;
            insert = 0;
            first = 0;
        };

        void add(T value) {
            if (amount > size - 1) { return; }
            if (insert == size) { insert = 0; }

            array[insert] = value;
            insert++;
            amount++;
        };

        T next() {
            if (amount == 0) { return null; }
            if (first == size) { first = 0; }

            T value = array[first];
            array[first] = null;

            amount--;
            first++;

            return value;
        }
};

#endif