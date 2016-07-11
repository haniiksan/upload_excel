Ext.define('RowGridEditor',{
    extend: 'Ext.grid.Panel',
    constructor: function(config) {
        config = config || {};
        this.store = Ext.create('Ext.data.Store',{
            fields:[
                {name: 'id', type: 'int'},
                {name: 'name', type: 'string'},
                {name: 'address', type: 'string'},
                {name: 'propinsi', type: 'string'},
                {name: 'kabupaten', type: 'string'},
                {name: 'kecamatan', type: 'string'},
                {name: 'kelurahan', type: 'string'},
                {name: 'kodepos', type: 'string'},
            ],
            proxy:{
                type:'ajax',
                url: 'http://localhost/ci/index.php/upload_excel/do_read',
                actionMethods:{read: 'post'},
                reader:{
                    type:'json',
                    root:'data'
                }
            },
            autoLoad:true,
            sorters:[{
                property: 'id',
                direction: 'ASC'
            }]
        });

        Ext.applyIf(config, {
            columns: [
                Ext.create('Ext.grid.RowNumberer',{ width: 30}),
                {header: 'Id', hidden: true, dataIndex:'id', filter:{type:'string'}},
                {header: 'Name', width: 150, dataIndex:'name', filter:{type:'string'},editor: {xtype: 'textfield'}},
                {header: 'Address', width: 150, dataIndex:'address', filter:{type:'string'},editor: {xtype: 'textfield'}},
                {header: 'Propinsi', width: 150, dataIndex:'propinsi', filter:{type:'string'},editor: {xtype: 'textfield'}},
                {header: 'Kabupaten', width: 150, dataIndex:'kabupaten', filter:{type:'string'},editor: {xtype: 'textfield'}},
                {header: 'Kecamatan', width: 150, dataIndex:'kecamatan', filter:{type:'string'},editor: {xtype: 'textfield'}},
                {header: 'Kelurahan', width: 150, dataIndex:'kelurahan', filter:{type:'string'},editor: {xtype: 'textfield'}},
                {header: 'Kodepos', width: 100, dataIndex:'kodepos', filter:{type:'string'},editor: {xtype: 'textfield'}},
            ],
            border: false,
            selModel: Ext.create('Ext.selection.CheckboxModel'),
            columnLines: true,
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    store: this.store,
                    displayInfo: true,
                    items: [
                        '-',
                        {
                            text: 'Upload',
                            iconCls: 'uploadIcon',
                            tooltip:'Upload File Excel',
                            scope: this,
                            handler: function(){
                                this.onUploadClick()
                            }
                        },'-'
                    ]
                }
            ]
        });
        this.callParent([config]);
    },
    onBoxReady: function() {
        this.callParent(arguments);
        Ext.defer(this.store.load, 500, this.store);
    },

    onUploadClick: function(){
        var me = this;
        var form = Ext.create('Ext.form.Panel', {
            bodyPadding: 10,
            method: 'POST',
            layout:'column',
            items: [{
                columnWidth: 0.50,
                flex: 1,
                bodyPadding: 5,
                items:[
                    {
                        xtype: 'filefield',
                        name: 'file_excel',
                        id: 'file_excel',
                        fieldLabel: 'Excel File',
                        buttonText: 'Select File',
                        labelWidth: 70,
                        allowBlank:false,
                        msgTarget: 'side',
                        width: 300
                    },
                    {
                        xtype: 'displayfield',
                        value: 'Don\'t have excel upload template ?<br> Click <a href="http://localhost/ci/assets/files/template_upload.xls"><b>here</b></a> to download.',
                        width: 250,
                        hideLabel: true,
                        style: 'font-size: 11px; margin-top: 20px'
                    }]
            }]
        });

        var win = Ext.create('Ext.window.Window', {
            title: 'Upload Excel',
            layout: 'fit',
            modal: true,
            frame:true,
            autoHeight: true,
            items: form,
            buttons: [{
                    text: 'Upload',
                    handler: function(){
                        var fp = form.getForm();
                        if(Ext.getCmp('file_excel').getValue() != ''){
                            pdf_file = Ext.getCmp('file_excel').getValue().split('.');

                            var nameExcel = pdf_file[1];
                            if(pdf_file[1] !='xls'){
                                me.showInfo('Please select Excel file');
                                return;
                            }
                        }
                        if (fp.isValid()){
                            fp.submit({
                                url: 'http://localhost/ci/index.php/upload_excel/do_upload',
                                waitMsg: 'Uploading... Please wait.',
                                params: {
                                    access:true,
                                    name: nameExcel
                                },
                                success: function(f, a, b) {
                                    var dd = Ext.decode(a.response.responseText);
                                    if (dd.success) {
                                      if(dd.info != undefined){
                                        win.close();
                                        me.getStore().reload();
                                      }
                                      else{
                                        win.close();
                                        me.getStore().reload();
                                        me.showInfo(a.result.msg);
                                      }
                                    }
                                },
                                failure: function(fp,o){

                                }
                            });
                        }
                    }
                },
                {
                    text:'Cancel',
                    handler: function(){
                        win.close();
                    }
                }
            ]
        });
 
        win.show();
    },
})

Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.create('Ext.Viewport', {
        layout: 'fit',
        items: Ext.create('RowGridEditor')
    });
});