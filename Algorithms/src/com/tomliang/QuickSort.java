package com.tomliang;

/**
 * 
 * @author lianghangbing
 * <p>快速排序</p>
 * <p>排序原理:</p>
 * <p>选择一个元素作为基准进行比较，小于它的在左边，大于它的在右边。左右两边元素再重复此操作(ps:递归调用)</p>
 * @param <T>
 */
public abstract class QuickSort<T> implements ISort<T> {

	@Override
	public void sort(T[] arr) {
		sort(arr, 0, arr.length-1);
	}
	
	private void sort(T[] arr, int lo, int hi){
		if(hi <= lo) return;
		int j = partition(arr, lo, hi);
		sort(arr, lo, j-1);
		sort(arr, j+1, hi);
	}

	private int partition(T[] arr, int lo, int hi) {
		int i=lo, j=hi+1;
		T v = arr[lo];
		while(true){
			while(less(arr[++i], v)) if(i == hi) break;
			while(less(v, arr[--j])) if(j == lo) break;
			
			if(i >= j) break;
			Utils.exc(arr, i, j);
		}
		Utils.exc(arr, lo, j);
		return j;
	}

	public abstract boolean less(T t1, T t2);
}
