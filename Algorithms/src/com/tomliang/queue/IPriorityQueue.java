package com.tomliang.queue;

/**
 * 
 * @author lianghangbing
 * <p>优先队列接口</p>
 */
public interface IPriorityQueue<T> {

	/**
	 * 插入一个元素
	 * @param t : void
	 */
	void insert(T t);
	
	/**
	 * 删除并返回一个最小元素
	 * @return : T
	 */
	T delMin();
	
	/**
	 * 返回最小元素
	 * @return : T
	 */
	T min();
	
	/**
	 * 返回队列大小
	 * @return : int
	 */
	int size();
	
	/**
	 * 是否是空
	 * @return : boolean
	 */
	boolean isEmpty();
	
}
