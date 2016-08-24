package com.tomliang.queue;

import com.tomliang.Utils;

/**
 * 
 * @author lianghangbing
 * <p>优先队列(无序)</p>
 * <p>原理:</p>
 * <p>此优先队列，插入元素操作不会进行排序，在取出元素的时候会进行一次选择排序，</p>
 * <p>保证可以快速插入，适用于频繁插入操作的场景，但是取出操作效率不高。</p>
 * @param <T>
 */
public class NoOrderPriorityQueue implements IPriorityQueue<Integer> {
	
	private int[] arr;
	private int size = 0;
	private Integer min;
	private int minIndex = 0;
	
	public NoOrderPriorityQueue(int size){
		arr = new int[size];
	}

	@Override
	public void insert(Integer t) {
		if(!contains(t)){
			arr[size] = t;
			size += 1;
			updateMin();
		}
	}
	
	private boolean contains(Integer t){
		if(size == 0) return false;
		
		for(int i=0; i < size; i++){
			if(t == arr[i]) return true;
		}
		return false;
	}
	
	public void updateMin(){
		minIndex = 0;
		min = arr[minIndex];
		for(int i=0; i < size; i++){
			if(arr[i] < min){
				min = arr[i];
				minIndex = i;
			}
		}
	}

	@Override
	public Integer delMin() {
		if(isEmpty()) return null;
		for(int i=minIndex; i < size-1; i++){
			arr[i] = arr[i+1];
		}
		arr[size-1] = 0;
		size -= 1;
		updateMin();
		return min;
	}

	@Override
	public Integer min() {
		return min;
	}

	@Override
	public int size() {
		return size;
	}

	@Override
	public boolean isEmpty() {
		return size == 0;
	}

	@Override
	public boolean less(Integer t1, Integer t2) {
		return t1 < t2;
	}

	public void print(){
		for(int i=0; i < size; i++){
			System.out.println("---->"+arr[i]);
		}
	}
}
