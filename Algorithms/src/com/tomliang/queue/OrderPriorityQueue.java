package com.tomliang.queue;

import com.tomliang.Utils;

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

	private Integer[] mArr;
	private int mSize = 0;
	public OrderPriorityQueue(int size){
		mArr = new Integer[size];
	}
	
	@Override
	public void insert(Integer t) {
		if(contains(t)) return;
		mArr[mSize] = t;
		for(int i=mSize; i>0 && mArr[i-1] < mArr[i]; i--){
			Utils.exc(mArr, i-1, i);
		}
		mSize += 1;
	}
	
	/**
	 * 判断是否包含该元素
	 * @param t
	 * @return
	 */
	private boolean contains(Integer t){
		if(mSize == 0) return false;
		
		for(int i=0; i < mSize; i++){
			if(t == mArr[i]) return true;
		}
		return false;
	}

	@Override
	public Integer delMin() {
		if(isEmpty()) return null;
		int min = mArr[mSize-1];
		mArr[mSize-1] = null;
		mSize -= 1;
		return min;
	}

	@Override
	public Integer min() {
		if(isEmpty()) return null;
		return mArr[mSize-1];
	}

	@Override
	public int size() {
		return mSize;
	}

	@Override
	public boolean isEmpty() {
		return mSize == 0;
	}

	/**
	 * 打印队列
	 */
	public void print(){
		for(int i=0; i < mSize; i++){
			System.out.println("---->"+mArr[i]);
		}
	}
}
