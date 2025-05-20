import heapq

def prim_algorithm(graph):

    if not graph:
        return [], 0
    
    # Выбираем начальную вершину (можно любую, возьмём первую)
    start_vertex = next(iter(graph))
    
    # Множество посещённых вершин
    visited = {start_vertex}
    
    # Очередь с приоритетом для рёбер (вес, текущая вершина, следующая вершина)
    edges = [
        (weight, start_vertex, neighbor)
        for neighbor, weight in graph[start_vertex]
    ]
    heapq.heapify(edges)
    
    minimum_spanning_tree = []
    total_weight = 0
    
    while edges:
        weight, current_vertex, next_vertex = heapq.heappop(edges)
        
        if next_vertex not in visited:
            visited.add(next_vertex)
            minimum_spanning_tree.append((current_vertex, next_vertex, weight))
            total_weight += weight
            
            # Добавляем все рёбра из новой вершины
            for neighbor, neighbor_weight in graph[next_vertex]:
                if neighbor not in visited:
                    heapq.heappush(edges, (neighbor_weight, next_vertex, neighbor))
    
    return minimum_spanning_tree, total_weight

def input_graph():

    graph = {}
    print("Введите количество вершин:")
    n = int(input())
    
    print("Введите рёбра в формате 'вершина1 вершина2 вес' (по одному ребру на строку):")
    print("(для завершения ввода введите пустую строку)")
    
    while True:
        edge_input = input().strip()
        if not edge_input:
            break
        
        try:
            v1, v2, weight = edge_input.split()
            v1, v2, weight = int(v1), int(v2), int(weight)
            
            # Добавляем ребро в обе стороны (для неориентированного графа)
            if v1 not in graph:
                graph[v1] = []
            if v2 not in graph:
                graph[v2] = []
                
            graph[v1].append((v2, weight))
            graph[v2].append((v1, weight))
        except ValueError:
            print("Некорректный ввод, попробуйте ещё раз")
    
    return graph

def main():
    print("Алгоритм Прима для построения минимального остовного дерева")
    
    # Ввод графа
    graph = input_graph()
    
    # Проверка на пустой граф
    if not graph:
        print("Граф пуст")
        return
    
    # Выполнение алгоритма Прима
    mst, total_weight = prim_algorithm(graph)
    
    # Вывод результатов
    print("\nМинимальное остовное дерево состоит из рёбер:")
    for edge in mst:
        print(f"{edge[0]} -- {edge[1]} (вес: {edge[2]})")
    print(f"Общий вес дерева: {total_weight}")

if __name__ == "__main__":
    main()