package com.tomliang;

/**
 * 
 * @author lianghangbing
 * <p>归并排序</p>
 * <p>排序原理:</p>
 * <p>利用递归思想，将数组拆分成小单元，复制一个数组，将数组分为2部分，左右两部分进行比较，将比较后的元素插入原数组中</p>
 * @param <T>
 */
public abstract class MergeSort<T> implements ISort<T> {

	public void sort(T[] arr) {
		if(arr == null){
			throw new IllegalArgumentException("数组不能为空");
		}
		sort(arr, 0, arr.length-1);
	}
	
	private void sort(T[] arr, int start, int end){
		if(start >= end){ // 如果分组达到最小单元，则停止分组
			return;
		}
		int mid = start + (end-start)/2;
		// 对左半部分分组
		sort(arr, start, mid);
		// 对右半部分分组
		sort(arr, mid+1, end);
		// 进行归并
		merge(arr, start, mid, end);
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
