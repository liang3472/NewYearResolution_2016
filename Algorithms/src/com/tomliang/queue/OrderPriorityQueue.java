package com.tomliang.queue;

/**
 * 
 * @author lianghangbing
 * <p>优先队列(有序)</p>
 * <p>原理:</p>
 * <p>此优先队列，使用插入排序原理，在插入元素时候就保证队列中元素是有序的。</p>
 * <p>但是每次进行插入元素的时候都会对队列中的元素进行排序。保证最大和最小元素都会在队列边缘，便于查找。适用于频繁查找的场景</p>
 * @param <T>
 */
public class OrderPriorityQueue implements IPriorityQueue<Integer> {

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
		return 0;
	}

	@Override
	public boolean isEmpty() {
		return false;
	}

	@Override
	public boolean less(Integer t1, Integer t2) {
		return false;
	}

}
