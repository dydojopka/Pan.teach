from collections import deque, defaultdict
import random

def generate_random_graph(n, density=0.3):
    """Генерирует случайный неориентированный граф"""
    graph = defaultdict(list)
    for i in range(n):
        for j in range(i+1, n):
            if random.random() < density:
                graph[i].append(j)
                graph[j].append(i)
    return graph

def get_valid_bfs(graph, start):
    visited = []
    queue = deque([start])
    visited.append(start)
    
    while queue:
        node = queue.popleft()
        # Сортируем соседей для детерминированного порядка
        for neighbor in sorted(graph[node]):
            if neighbor not in visited:
                visited.append(neighbor)
                queue.append(neighbor)
    return visited

def is_valid_bfs(user_input, correct_bfs):

    return user_input == correct_bfs

def main():
    print("Программа проверки BFS-обхода графа")
    n = int(input("Введите количество вершин (≤20): "))
    
    # Генерация или ввод графа
    choice = input("Сгенерировать случайный граф? (y/n): ").lower()
    if choice == 'y':
        graph = generate_random_graph(n)
    else:
        graph = defaultdict(list)
        print("Введите список смежности (формат: 'вершина:сосед1 сосед2...')")
        for _ in range(n):
            parts = input().split(':')
            node = int(parts[0])
            neighbors = list(map(int, parts[1].split()))
            graph[node] = neighbors
    
    # Вывод информации о графе
    print("\nСписок смежности графа:")
    for node in sorted(graph):
        print(f"{node}: {graph[node]}")
    
    # Получаем корректный BFS
    start_node = int(input("\nВведите стартовую вершину: "))
    correct_bfs = get_valid_bfs(graph, start_node)
    
    # Проверка пользовательского ввода
    user_bfs = list(map(int, input("Введите ваш BFS-обход (через пробел): ").split()))
    
    if is_valid_bfs(user_bfs, correct_bfs):
        print("✅ Верно! Это корректный BFS-обход.")
    else:
        print("❌ Неверно! Правильный порядок:", ' → '.join(map(str, correct_bfs)))

if __name__ == "__main__":
    main()