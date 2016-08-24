package com.tomliang.sort;

import com.tomliang.Utils;

/**
 * 
 * @author lianghangbing
 * <p>选择排序</p>
 * <p>排序原理:</p>
 * <p>每次循环选出最小元素，并把最小元素放置在左边位置。然后继续向右边的循环</p>
 * <p>时间复杂度: n^2/2</p>
 * <p>成本模型:比较大小 count = (n-1)*n/2</p>
 * @param <T>
 */
public abstract class SelectSort<T> implements ISort<T> {

	public void sort(T[] arr) {
		if(arr == null){
			throw new IllegalArgumentException("数组不能为空");
		}
		
		if(arr.length > 0){
			for(int i=0; i < arr.length; i++){
				for(int j=i+1; j<arr.length; j++){
					if(less(arr[i],arr[j])){
						Utils.exc(arr, i, j);
					}
				}
			}
		}
	}
	
	public abstract boolean less(T t1, T t2);
}
