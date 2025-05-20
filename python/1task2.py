import numpy as np
import random
from collections import defaultdict

def generate_random_adjacency_matrix(n, density=0.3):
    """Генерирует случайную матрицу смежности (неориентированный граф без петель)."""
    matrix = np.zeros((n, n), dtype=int)
    for i in range(n):
        for j in range(i + 1, n):
            if random.random() < density:
                matrix[i][j] = 1
                matrix[j][i] = 1
    return matrix

def dfs_correct(graph, start):
    """Эталонный DFS-обход (сортировка соседей для детерминированности)."""
    visited = []
    stack = [start]
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.append(node)
            stack.extend(sorted(graph[node], reverse=True))  # Добавляем соседей в порядке убывания
    return visited

def is_valid_dfs(user_input, correct_dfs):
    """Проверяет, является ли ввод пользователя корректным DFS."""
    return user_input == correct_dfs

def main():
    n = int(input("Введите количество вершин графа (≤ 20): "))
    if n > 20:
        print("Ошибка: вершин должно быть не больше 20!")
        return

    # Генерируем или вводим граф
    choice = input("Сгенерировать случайный граф? (y/n): ").lower()
    if choice == 'y':
        matrix = generate_random_adjacency_matrix(n)
    else:
        print("Введите матрицу смежности (построчно, числа через пробел):")
        matrix = []
        for _ in range(n):
            row = list(map(int, input().split()))
            matrix.append(row)
        matrix = np.array(matrix)

    # Преобразуем матрицу в список смежности
    graph = defaultdict(list)
    for i in range(n):
        for j in range(n):
            if matrix[i][j] == 1:
                graph[i].append(j)

    print("\nСгенерированный граф (список смежности):")
    for node in sorted(graph):
        print(f"{node}: {graph[node]}")

    start_node = int(input("\nВведите стартовую вершину для DFS: "))
    correct_dfs = dfs_correct(graph, start_node)
    print(f"\nПравильный DFS-обход (для проверки): {correct_dfs}")

    user_input = list(map(int, input("Введите ваш вариант DFS (через пробел): ").split()))
    if is_valid_dfs(user_input, correct_dfs):
        print("✅ Верно! Это корректный DFS-обход.")
    else:
        print("❌ Неверно! Правильный порядок:", correct_dfs)

if __name__ == "__main__":
    main()