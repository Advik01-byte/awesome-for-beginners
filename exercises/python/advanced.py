# Advanced Python Exercise

class Fibonacci:
    def __init__(self):
        self.cache = {}

    def fib(self, n):
        if n in self.cache:
            return self.cache[n]
        if n <= 2:
            return 1
        self.cache[n] = self.fib(n - 1) + self.fib(n - 2)
        return self.cache[n]

f = Fibonacci()
print(f.fib(10))