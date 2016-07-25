package com.coderstudio.tomliang.fe_webviewtool.utils;

import android.support.design.widget.Snackbar;
import android.view.View;

import java.util.regex.Pattern;

/**
 * Created by lianghangbing on 16/7/25.
 */

public class Utils {
    private Utils() {

    }

    public static boolean isUrl(String strLink) {
        Pattern pattern = Pattern
                .compile("^([hH][tT]{2}[pP]://|[hH][tT]{2}[pP][sS]://)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\\/])+$");
        return pattern.matcher(strLink).matches();
    }

    public static void toastMsg(View view, String msg){
        Snackbar.make(view, msg, Snackbar.LENGTH_SHORT).show();
    }

    public static String getInjectErudaJs(){
        String jsLib = "javascript:(function () { " +
                "var script = document.createElement('script');" +
                " script.src=\"//liriliri.github.io/eruda/eruda.min.js\";" +
                " script.onload = function () { eruda.init(); };" +
                " document.body.appendChild(script);})();";
        return jsLib;
    }
}
