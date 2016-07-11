<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Upload_excel extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		$this->load->model('upload_excel_model','get_db');
	}
	public function index()
	{
		$this->load->view('upload_excel_view');
	}

	public function do_read(){
		$result = $this->get_db->do_read();
        echo '{success: true, total: '.$result->num_rows().', data: '.utf8_encode(json_encode($result->result_array())).'}';
	}

	public function do_upload(){
		// Load Helper Excel Reader
		$this->load->helpers(array('excel_reader2'));

		// Pengecekan File, file yang di upload hanya boleh extensi .xls
		if (!empty($_FILES['file_excel']['tmp_name'])){
			if ($_FILES['file_excel']['type'] == 'application/force-download' || $_FILES['file_excel']['type'] == 'application/vnd.ms-excel' || $_FILES['file_excel']['type'] == 'application/octet-stream' || $_FILES['file_excel']['type'] == 'application/excel')
			{
				$data = new Spreadsheet_Excel_Reader($_FILES['file_excel']['tmp_name']);
				$row = $data->rowcount($sheet_index = 0);
				$success = 0;

				$start_row = 2; // Mulai dari row 2
				for ($i = 2; $i <= $row; $i++){
					$param['name'] = $data->val($i, 2); // Mapping Header Colom B ke field name
					$param['address'] = $data->val($i, 3); // Mapping Header Colom C ke field address
					$param['propinsi'] = $data->val($i, 4); // Mapping Header Colom D ke field propinsi
					$param['kabupaten'] = $data->val($i, 5); // Mapping Header Colom E ke field kabupaten
					$param['kecamatan'] = $data->val($i, 6); // Mapping Header Colom F ke field kecamatan
					$param['kelurahan'] = $data->val($i, 7); // Mapping Header Colom G ke field kelurahan
					$param['kodepos'] = $data->val($i, 8); // Mapping Header Colom H ke field kodepos
					
					// Sudah ke mapping kolom nya, baru deh kita insert.. (:
					$this->get_db->do_insert($param);
					$success++;
				}
				if($success > 0){
					echo "{success:true}";
				}
			}
			else{
				echo "{success:false, msg:'Invalid file extension, accept .xls files only !!'}";
			}
		}
		else{
			echo "{success:false, msg:'No file found!'}";
		}
	}
}
