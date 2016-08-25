package com.tomliang.queue;

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
	
	private int[] mArr;
	private int mSize = 0;
	private Integer mMin;
	private int mMinIndex = 0;
	
	public NoOrderPriorityQueue(int size){
		mArr = new int[size];
	}

	@Override
	public void insert(Integer t) {
		if(!contains(t)){
			mArr[mSize] = t;
			mSize += 1;
			updateMin();
		}
	}
	
	private boolean contains(Integer t){
		if(mSize == 0) return false;
		
		for(int i=0; i < mSize; i++){
			if(t == mArr[i]) return true;
		}
		return false;
	}
	
	public void updateMin(){
		mMinIndex = 0;
		mMin = mArr[mMinIndex];
		for(int i=0; i < mSize; i++){
			if(mArr[i] < mMin){
				mMin = mArr[i];
				mMinIndex = i;
			}
		}
	}

	@Override
	public Integer delMin() {
		if(isEmpty()) return null;
		for(int i=mMinIndex; i < mSize-1; i++){
			mArr[i] = mArr[i+1];
		}
		mArr[mSize-1] = 0;
		mSize -= 1;
		updateMin();
		return mMin;
	}

	@Override
	public Integer min() {
		return mMin;
	}

	@Override
	public int size() {
		return mSize;
	}

	@Override
	public boolean isEmpty() {
		return mSize == 0;
	}

	public void print(){
		for(int i=0; i < mSize; i++){
			System.out.println("---->"+mArr[i]);
		}
	}
}
