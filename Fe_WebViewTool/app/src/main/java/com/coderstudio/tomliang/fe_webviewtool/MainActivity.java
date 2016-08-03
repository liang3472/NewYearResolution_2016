package com.coderstudio.tomliang.fe_webviewtool;

import android.content.Intent;
import android.text.TextUtils;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.coderstudio.tomliang.fe_webviewtool.bean.History;
import com.coderstudio.tomliang.fe_webviewtool.dao.HistoryDao;
import com.coderstudio.tomliang.fe_webviewtool.itf.HistoryOperationI;
import com.coderstudio.tomliang.fe_webviewtool.utils.Utils;
import com.coderstudio.tomliang.fe_webviewtool.zxing.CaptureActivity;

import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import butterknife.BindView;

public class MainActivity extends BaseActivity
        implements NavigationView.OnNavigationItemSelectedListener, HistoryOperationI {

    @BindView(R.id.drawer_layout)
    protected DrawerLayout drawer;
    @BindView(R.id.nav_view)
    protected NavigationView navigationView;
    @BindView(R.id.toolbar)
    protected Toolbar toolbar;
    @BindView(R.id.wv_content)
    protected WebView wvContent;
    @BindView(R.id.btn_goto)
    protected Button btnGoTo;
    @BindView(R.id.et_url)
    protected EditText etUrl;
    @BindView(R.id.progressbar)
    protected ProgressBar progressBar;
    private HistoryDao historyDao;

    @Override
    protected int getContentView() {
        return R.layout.activity_main;
    }

    @Override
    protected void initView() {
        historyDao = AppContext.getInstance().getDaoSession().getHistoryDao();
        initActionBar();
        initWebView();
        navigationView.setNavigationItemSelectedListener(this);
        btnGoTo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(!etUrl.getText().toString().startsWith("http")){
                    etUrl.setText("http://"+etUrl.getText().toString());
                }

                if (!TextUtils.isEmpty(etUrl.getText())) {
                    if (Utils.isUrl(etUrl.getText().toString())) {
                        goToUrl(etUrl.getText().toString());
                    } else {
                        Utils.toastMsg(v, "不是一个链接");
                    }
                }
            }
        });
    }

    private void initActionBar() {
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.setDrawerListener(toggle);
        toggle.syncState();
    }

    private void initWebView() {
        wvContent.getSettings().setJavaScriptEnabled(true);
        wvContent.getSettings().setDomStorageEnabled(true);
        wvContent.setWebViewClient(new WebViewClient() {

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // TODO Auto-generated method stub
                view.loadUrl(url);
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                if (etUrl != null) {
                    etUrl.setText(url);
                }
                view.loadUrl(Utils.injectJsLib(Utils.getInjectErudaJs(), Utils.getInjectLiveJs()));
                super.onPageFinished(view, url);
            }

            @Override
            public void onLoadResource(WebView view, String url) {
                super.onLoadResource(view, url);
                Log.e("test", url);
            }
        });

        wvContent.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (progressBar != null) {
                    progressBar.setProgress(newProgress);
                    if (newProgress >= 100) {
                        progressBar.setVisibility(View.GONE);
                    }
                }
            }

        });
    }

    private void goToUrl(String url){
        wvContent.loadUrl(url);
        addHistory(url);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onNavigationItemSelected(MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.qr_scan) {
            startActivityForResult(new Intent(this, CaptureActivity.class), CaptureActivity.OPEN_QR);
        } else if (id == R.id.checkWebGL) {
            wvContent.loadUrl("file:///android_asset/testWebGL.html");
        } else if (id == R.id.nav_slideshow) {

        } else if (id == R.id.nav_manage) {

        } else if (id == R.id.nav_history) {
            startActivityForResult(new Intent(this, HistoryActivity.class), HistoryActivity.OPEN_HISTORY);
        } else if (id == R.id.nav_send) {

        }

        drawer.closeDrawer(GravityCompat.START);
        return true;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

        switch (requestCode) {
            case CaptureActivity.OPEN_QR:
                //扫描二维码返回
                if (null != data) {
                    String url = data.getStringExtra(CaptureActivity.QR_RESULT);
                    etUrl.setText(url);
                    goToUrl(url);
                }
                break;
            case HistoryActivity.OPEN_HISTORY:
                //扫描二维码返回
                if (null != data) {
                    String url = data.getStringExtra(HistoryActivity.HISTORY_RESULT);
                    etUrl.setText(url);
                    goToUrl(url);
                }
                break;
            default:
                break;
        }

        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void addHistory(String url) {
        History history = new History(url);
        List<History> histories = historyDao.queryBuilder().where(HistoryDao.Properties.Url.eq(url)).list();
        if (histories != null && histories.size() > 0) {
            History old = histories.get(0);
            history.setCount(old.getCount() + 1);
        } else {
            history.setCount(1);
        }
        historyDao.insertOrReplace(history);
    }

    @Override
    public List<History> getHistories() {
        return null;
    }

    /**
     * 菜单、返回键响应
     */
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            if (drawer.isDrawerOpen(GravityCompat.START)) {
                drawer.closeDrawer(GravityCompat.START);
                return false;
            }
            exitBy2Click(); //调用双击退出函数
        }
        return false;
    }

    /**
     * 双击退出函数
     */
    private static Boolean isExit = false;

    private void exitBy2Click() {
        Timer tExit = null;
        if (!isExit) {
            isExit = true; // 准备退出
            Toast.makeText(this, "再次点击退出程序", Toast.LENGTH_SHORT).show();
            tExit = new Timer();
            tExit.schedule(new TimerTask() {
                @Override
                public void run() {
                    isExit = false; // 取消退出
                }
            }, 2000); // 如果2秒钟内没有按下返回键，则启动定时器取消掉刚才执行的任务

        } else {
            finish();
        }
    }


}
