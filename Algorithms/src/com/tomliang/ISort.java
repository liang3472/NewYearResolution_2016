package com.tomliang;

public interface ISort<T> {
	
	/**
	 * 排序
	 * @param arr
	 */
	void sort(T[] arr);
	
	/**
	 * 比较大小
	 * @param index1 角标1
	 * @param index2 角标2
	 */
	boolean less(T t1, T t2);
}
