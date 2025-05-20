def floyd_warshall(graph):

    n = len(graph)
    # Инициализация матрицы расстояний и предков
    dist = [[float('infinity')] * n for _ in range(n)]
    next_node = [[None] * n for _ in range(n)]
    
    for i in range(n):
        for j in range(n):
            if graph[i][j] != 0:  # 0 означает отсутствие ребра в нашей модели
                dist[i][j] = graph[i][j]
                next_node[i][j] = j
        dist[i][i] = 0  # Расстояние от вершины к себе
    
    # Основная часть алгоритма
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][j] > dist[i][k] + dist[k][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
                    next_node[i][j] = next_node[i][k]
    
    return dist, next_node

def reconstruct_path(next_node, start, end):

    if next_node[start][end] is None:
        return []
    path = [start]
    while start != end:
        start = next_node[start][end]
        path.append(start)
    return path

def input_graph():

    print("Введите количество вершин:")
    n = int(input())
    print("Введите матрицу смежности (построчно, через пробел):")
    print("(используйте 0 для обозначения отсутствия ребра)")
    graph = []
    for _ in range(n):
        row = list(map(int, input().split()))
        graph.append(row)
    return graph

def print_matrix(matrix):

    n = len(matrix)
    for i in range(n):
        print(" ".join(f"{val:5}" if val != float('infinity') else "  inf" for val in matrix[i]))

def main():
    print("Алгоритм Флойда-Уоршелла для построения матрицы кратчайших путей")
    graph = input_graph()
    
    dist, next_node = floyd_warshall(graph)
    
    print("\nМатрица кратчайших расстояний:")
    print_matrix(dist)
    
    # Пример вывода путей
    print("\nПримеры путей:")
    n = len(graph)
    for i in range(n):
        for j in range(n):
            if i != j:
                path = reconstruct_path(next_node, i, j)
                if path:
                    print(f"Путь от {i} до {j}: {' → '.join(map(str, path))}, расстояние: {dist[i][j]}")
                else:
                    print(f"Путь от {i} до {j} не существует")

if __name__ == "__main__":
    main()