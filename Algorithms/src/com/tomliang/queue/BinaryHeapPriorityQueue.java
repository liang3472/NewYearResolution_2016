package com.tomliang.queue;

import com.tomliang.Utils;

/**
 * 
 * @author lianghangbing
 * <p>优先队列(二叉堆实现)</p>
 * <p>原理:</p>
 * <p>用二叉堆实现优先队列，在叶子节点插入元素，然后将该原素上浮到合适的位置上</p>
 * <p>最小元素在根节点，删除元素时将根节点元素移除，将叶子节点移动到根节点，然后将该节点下沉到合适位置上</p>
 * @param <T>
 */
public abstract class BinaryHeapPriorityQueue<T> implements IPriorityQueue<T> {
	
	private T[] mArr; 
	private int mSize = 0;
	public BinaryHeapPriorityQueue(int size){
		mArr = (T[]) new Object[size];
	}

	@Override
	public void insert(T t) {
		mArr[mSize] = t;
		swim(mSize++);
	}

	@Override
	public T delMin() {
		if(isEmpty()) return null;
		T min = mArr[0];
		Utils.exc(mArr, 0, --mSize);
		mArr[mSize] = null;
		sink(0);
		return min;
	}

	@Override
	public T min() {
		if(isEmpty()) return null;
		return mArr[0];
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
	 * 将元素下沉到合适位置，如果当前节点大于子节点(左2k,右2+1),则交换位置
	 * @param k : void
	 */
	public void sink(int k){
		while(2*k <= mSize-1){
			int i = 2*k;
			if(i < mSize-1 && less(mArr[i+1], mArr[i])) i++;
			if(!less(mArr[i], mArr[k])) break;
			Utils.exc(mArr, i, k);
			k = i;
		}
	}
	
	/**
	 * 将元素上升到合适位置，如果当前节点小于父节点(k/2),则交换位置。
	 * @param k : void
	 */
	public void swim(int k){
		while(k > 0 && less(mArr[k], mArr[k/2])){
			Utils.exc(mArr, k, k/2);
			k = k/2;
		}
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
