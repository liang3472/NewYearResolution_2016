package com.tomliang.queue;

public class QueueMain {
	public static void main(String[] args){
		int[] arr = {11,6,4,2,1,7,10,5,3,8,0,9,20};
		int M = 5;
//		NoOrderPriorityQueue pq = new NoOrderPriorityQueue(M + 1);
//		for(int i=0; i < arr.length; i++){
//			pq.insert(arr[i]);
//			if(pq.size() > M){
//				pq.delMin();
//			}
//		}
		OrderPriorityQueue pq = new OrderPriorityQueue(M + 1);
		for(int i=0; i < arr.length; i++){
			pq.insert(arr[i]);
			if(pq.size() > M){
				pq.delMin();
			}
		}
		pq.print();
	}
}