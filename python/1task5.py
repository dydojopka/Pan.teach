from collections import deque

def input_graph():
    print("\nВыберите способ задания графа:")
    print("1. Матрица смежности")
    print("2. Матрица инцидентности")
    print("3. Список смежности")
    choice = input("Ваш выбор (1/2/3): ")
    
    if choice == '1':
        return input_adjacency_matrix()
    elif choice == '2':
        return input_incidence_matrix()
    elif choice == '3':
        return input_adjacency_list()
    else:
        print("Неверный выбор!")
        return None

def input_adjacency_matrix():
    n = int(input("Введите количество вершин: "))
    print("Введите матрицу смежности (построчно, через пробел):")
    matrix = []
    for _ in range(n):
        row = list(map(int, input().split()))
        matrix.append(row)
    
    # Преобразуем в список смежности
    graph = {i: [] for i in range(n)}
    for i in range(n):
        for j in range(n):
            if matrix[i][j] == 1:
                graph[i].append(j)
    return graph

def input_incidence_matrix():
    n = int(input("Введите количество вершин: "))
    m = int(input("Введите количество ребер: "))
    print("Введите матрицу инцидентности (построчно, через пробел):")
    matrix = []
    for _ in range(n):
        row = list(map(int, input().split()))
        matrix.append(row)
    
    # Преобразуем в список смежности
    graph = {i: [] for i in range(n)}
    for j in range(m):
        vertices = []
        for i in range(n):
            if matrix[i][j] == 1:
                vertices.append(i)
        if len(vertices) == 2:  # Для неориентированного графа
            u, v = vertices
            graph[u].append(v)
            graph[v].append(u)
    return graph

def input_adjacency_list():
    n = int(input("Введите количество вершин: "))
    print("Введите список смежности (в формате 'вершина:сосед1 сосед2 ...'):")
    graph = {}
    for _ in range(n):
        parts = input().split(':')
        node = int(parts[0])
        neighbors = list(map(int, parts[1].split()))
        graph[node] = neighbors
    return graph

def count_connected_components(graph):
    if not graph:
        return 0
    
    visited = set()
    components = 0
    
    for node in graph:
        if node not in visited:
            # BFS для поиска всей компоненты
            queue = deque([node])
            visited.add(node)
            
            while queue:
                current = queue.popleft()
                for neighbor in graph[current]:
                    if neighbor not in visited:
                        visited.add(neighbor)
                        queue.append(neighbor)
            
            components += 1
    
    return components

def main():
    print("Программа для подсчета компонент связности графа")
    graph = input_graph()
    
    if graph is not None:
        print("\nСписок смежности графа:")
        for node in sorted(graph):
            print(f"{node}: {graph[node]}")
        
        num_components = count_connected_components(graph)
        print(f"\nКоличество компонент связности: {num_components}")

if __name__ == "__main__":
    main()