import numpy as np
import matplotlib.pyplot as plt
import networkx as nx

def input_adjacency_matrix():
    n = int(input("Введите количество вершин графа (не более 20): "))
    print("Введите матрицу смежности (построчно, элементы через пробел):")
    matrix = []
    for _ in range(n):
        row = list(map(int, input().split()))
        matrix.append(row)
    return np.array(matrix)

def adjacency_matrix_to_graph(matrix):
    G = nx.DiGraph() if np.any(matrix != matrix.T) else nx.Graph()
    n = matrix.shape[0]
    for i in range(n):
        for j in range(n):
            if matrix[i][j] != 0:
                G.add_edge(i, j, weight=matrix[i][j])
    return G

def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    visited.add(start)
    print(start, end=' ')
    for neighbor in sorted(graph[start]):  # Сортируем для детерминированного порядка
        if neighbor not in visited:
            dfs(graph, neighbor, visited)

def visualize_graph(graph):
    pos = nx.spring_layout(graph)
    nx.draw(graph, pos, with_labels=True, node_color='lightblue', 
            edge_color='gray', arrows=True)
    edge_labels = nx.get_edge_attributes(graph, 'weight')
    nx.draw_networkx_edge_labels(graph, pos, edge_labels=edge_labels)
    plt.show()

def main():
    matrix = input_adjacency_matrix()
    graph_nx = adjacency_matrix_to_graph(matrix)
    graph_dict = {i: [] for i in range(matrix.shape[0])}
    
    # Преобразуем матрицу смежности в словарь (список смежности)
    for i in range(matrix.shape[0]):
        for j in range(matrix.shape[1]):
            if matrix[i][j] != 0:
                graph_dict[i].append(j)
    
    print("\nСписок смежности графа:")
    for node, neighbors in graph_dict.items():
        print(f"{node}: {neighbors}")
    
    start_node = int(input("\nВведите стартовую вершину для обхода DFS: "))
    print("\nПорядок обхода DFS:", end=' ')
    dfs(graph_dict, start_node)
    
    # Визуализация графа (опционально)
    visualize = input("\nВизуализировать граф? (y/n): ").lower()
    if visualize == 'y':
        visualize_graph(graph_nx)

if __name__ == "__main__":
    main()