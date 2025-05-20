from collections import deque, defaultdict
import networkx as nx
import matplotlib.pyplot as plt

def input_graph():
    print("Выберите способ задания графа:")
    print("1. Матрица смежности")
    print("2. Матрица инцидентности")
    print("3. Список смежности")
    choice = int(input("Ваш выбор (1/2/3): "))

    if choice == 1:
        return input_adjacency_matrix()
    elif choice == 2:
        return input_incidence_matrix()
    elif choice == 3:
        return input_adjacency_list()
    else:
        print("Ошибка: неверный выбор!")
        return None

def input_adjacency_matrix():
    n = int(input("Введите количество вершин: "))
    print("Введите матрицу смежности (построчно, через пробел):")
    matrix = []
    for _ in range(n):
        row = list(map(int, input().split()))
        matrix.append(row)
    return adjacency_matrix_to_dict(matrix)

def input_incidence_matrix():
    n = int(input("Введите количество вершин: "))
    m = int(input("Введите количество рёбер: "))
    print("Введите матрицу инцидентности (построчно, через пробел):")
    matrix = []
    for _ in range(n):
        row = list(map(int, input().split()))
        matrix.append(row)
    return incidence_matrix_to_dict(matrix, m)

def input_adjacency_list():
    n = int(input("Введите количество вершин: "))
    graph = defaultdict(list)
    print("Введите список смежности (в формате 'вершина: сосед1 сосед2 ...'):")
    for _ in range(n):
        parts = input().split(':')
        node = int(parts[0])
        neighbors = list(map(int, parts[1].strip().split()))
        graph[node] = neighbors
    return graph

def adjacency_matrix_to_dict(matrix):
    graph = defaultdict(list)
    for i in range(len(matrix)):
        for j in range(len(matrix[i])):
            if matrix[i][j] == 1:
                graph[i].append(j)
    return graph

def incidence_matrix_to_dict(matrix, m):
    graph = defaultdict(list)
    for j in range(m):
        edge = []
        for i in range(len(matrix)):
            if matrix[i][j] != 0:
                edge.append(i)
        if len(edge) == 2:  # Неориентированное ребро
            graph[edge[0]].append(edge[1])
            graph[edge[1]].append(edge[0])
    return graph

def bfs(graph, start):
    visited = []
    queue = deque([start])
    visited.append(start)
    
    while queue:
        node = queue.popleft()
        for neighbor in sorted(graph[node]):  # Сортируем для детерминированности
            if neighbor not in visited:
                visited.append(neighbor)
                queue.append(neighbor)
    return visited

def visualize_graph(graph):
    G = nx.Graph()
    for node in graph:
        G.add_node(node)
        for neighbor in graph[node]:
            G.add_edge(node, neighbor)
    pos = nx.spring_layout(G)
    nx.draw(G, pos, with_labels=True, node_color='lightblue', edge_color='gray')
    plt.show()

def main():
    graph = input_graph()
    if not graph:
        return
    
    print("\nСписок смежности графа:")
    for node in sorted(graph):
        print(f"{node}: {graph[node]}")
    
    start_node = int(input("\nВведите стартовую вершину для BFS: "))
    bfs_order = bfs(graph, start_node)
    print("\nПорядок обхода BFS:", ' → '.join(map(str, bfs_order)))
    
    if input("\nВизуализировать граф? (y/n): ").lower() == 'y':
        visualize_graph(graph)

if __name__ == "__main__":
    main()