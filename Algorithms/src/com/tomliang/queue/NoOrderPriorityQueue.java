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
	private int currIndex = 0;
	private int temp;
	
	public NoOrderPriorityQueue(int size){
		temp = size + 1;
		arr = new int[size];
	}

	@Override
	public void insert(Integer t) {
		
	}

	@Override
	public Integer delMin() {
		return null;
	}

	@Override
	public Integer min() {
		return null;
	}

	@Override
	public int size() {
		return currIndex + 1;
	}

	@Override
	public boolean isEmpty() {
		return false;
	}

	@Override
	public boolean less(Integer t1, Integer t2) {
		return t1 < t2;
	}

}
