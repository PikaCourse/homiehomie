<nav className="navbar navbar-expand-lg navbar-light bg-light border-0 pb-2 pt-2">
      <div className="container-fluid">
        <a className="navbar-brand mx-4" href="#" style={selectedStyle}>
          CourseWiki
        </a>
        <div>
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <Button size="medium" style={{ color: "#419EF4"}}>
                <FontAwesomeIcon icon={faStar} />
              </Button>
            </li>
            <li class="nav-item">
              <Button type="primary" onClick={showModal}>
                Login
              </Button>
              <Modal
                visible={visible}
                title="Title"
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
              >
                <Form
                  name="normal_login"
                  className="login-form"
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={login ? loginSubmit : signupSubmit}
                  // onFinishFailed={}
                >
                  <Form.Item label="">
                    <Radio.Group
                      onChange={onFormTypeChange}
                      value={login ? "login" : "signup"}
                    >
                      <Radio.Button value="login">Login</Radio.Button>
                      <Radio.Button value="signup">Sign Up</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                  {login ? loginForm : signupForm}
                  {login ? loginFooter : signupFooter}
                </Form>
              </Modal>
            </li>
          </ul>
        </div>
      </div>
    </nav>
   