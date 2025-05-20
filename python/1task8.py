import heapq

def dijkstra(graph, start):

    # Инициализация: все расстояния бесконечны, кроме стартовой вершины
    distances = {vertex: float('infinity') for vertex in graph}
    distances[start] = 0
    # Словарь для хранения предков (для восстановления путей)
    previous = {vertex: None for vertex in graph}
    
    # Приоритетная очередь (min-heap)
    priority_queue = [(0, start)]
    
    while priority_queue:
        current_distance, current_vertex = heapq.heappop(priority_queue)
        
        # Если найден более короткий путь - пропускаем
        if current_distance > distances[current_vertex]:
            continue
            
        for neighbor, weight in graph[current_vertex]:
            distance = current_distance + weight
            
            # Если найден более короткий путь до соседа
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                previous[neighbor] = current_vertex
                heapq.heappush(priority_queue, (distance, neighbor))
    
    return distances, previous

def input_graph():

    graph = {}
    print("Введите количество вершин:")
    n = int(input())
    
    print("Введите рёбра в формате 'вершина1 вершина2 вес' (по одному ребру на строку):")
    print("(для завершения ввода введите пустую строку)")
    
    for i in range(n):
        graph[i] = []
    
    while True:
        edge_input = input().strip()
        if not edge_input:
            break
        
        try:
            v1, v2, weight = edge_input.split()
            v1, v2, weight = int(v1), int(v2), int(weight)
            
            # Добавляем ребро в обе стороны (если граф неориентированный)
            graph[v1].append((v2, weight))
            graph[v2].append((v1, weight))
        except ValueError:
            print("Некорректный ввод, попробуйте ещё раз")
    
    return graph, n

def reconstruct_path(previous, start, end):
    """
    Восстановление пути от start до end
    """
    path = []
    current = end
    while current != start:
        path.append(current)
        current = previous[current]
        if current is None:
            return None  # Путь не существует
    path.append(start)
    path.reverse()
    return path

def main():
    print("Алгоритм Дейкстры для нахождения кратчайших путей")
    
    # Ввод графа
    graph, n = input_graph()
    
    # Проверка на пустой граф
    if not graph:
        print("Граф пуст")
        return
    
    # Ввод стартовой вершины
    start_vertex = int(input("Введите стартовую вершину: "))
    if start_vertex not in graph:
        print("Такой вершины нет в графе")
        return
    
    # Выполнение алгоритма Дейкстры
    distances, previous = dijkstra(graph, start_vertex)
    
    # Вывод результатов
    print("\nКратчайшие расстояния от вершины", start_vertex)
    for vertex in sorted(distances):
        if vertex != start_vertex:
            path = reconstruct_path(previous, start_vertex, vertex)
            if path:
                print(f"До вершины {vertex}: расстояние = {distances[vertex]}, путь: {' -> '.join(map(str, path))}")
            else:
                print(f"До вершины {vertex}: недостижима")

if __name__ == "__main__":
    main()