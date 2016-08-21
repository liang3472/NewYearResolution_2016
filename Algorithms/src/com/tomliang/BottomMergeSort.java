package com.tomliang;

/**
 * 
 * @author lianghangbing
 * <p>自底向上原地归并排序</p>
 * <p>排序原理:</p>
 * <p>不使用递归，将元素按两两归并，四四归并，八八归并...直到归并完成</p>
 * @param <T>
 */
public abstract class BottomMergeSort<T> implements ISort<T> {

	public void sort(T[] arr) {
		if(arr == null){
			throw new IllegalArgumentException("数组不能为空");
		}
		int N = arr.length;
		for(int sz=1; sz<N; sz=sz+sz){
			for(int lo=0; lo<N-sz; lo+=sz+sz){
				merge(arr, lo, lo+sz-1, Math.min(lo+sz+sz-1, N-1));
			}
		}
	}
	
	private void merge(T[] arr, int start, int mid, int end){
		T[] cpArr = copyArray(arr);
		int i = start;
		int j = mid + 1;
		for(int k=start; k<=end; k++){
			if(i > mid)							arr[k] = cpArr[j++]; // 左边角标到头，右边元素直接复制到原数组中
			else if(j > end)					arr[k] = cpArr[i++]; // 右边角标到头，左边元素直接复制到原数组中
			else if(less(cpArr[j], cpArr[i]))	arr[k] = cpArr[j++]; // 当右边元素小余左边元素，将右边元素复制到原数组中
			else								arr[k] = cpArr[i++]; // 左边元素复制到原数组
		}
	}
	
	/**
	 * 复制一个数组
	 * @param arr
	 * @return
	 */
	private T[] copyArray(T[] arr){
		return arr.clone();
	}
	
	public abstract boolean less(T t1, T t2);

}
